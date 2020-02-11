<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class TimerController extends AbstractController
{
    /**
     * @Route("/", name="timer")
     */
    public function index()
    {
        return $this->render('timer/index.html.twig', [
            'controller_name' => 'TimerController',
        ]);
    }
}
